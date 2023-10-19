import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import dayjs from "@calcom/dayjs";
import { hashPassword } from "@calcom/features/auth/lib/hashPassword";
import { sendEmailVerification } from "@calcom/features/auth/lib/verifyEmail";
import slugify from "@calcom/lib/slugify";
import { closeComUpsertTeamUser } from "@calcom/lib/sync/SyncServiceManager";
import prisma from "@calcom/prisma";
import { IdentityProvider } from "@calcom/prisma/enums";
import { teamMetadataSchema } from "@calcom/prisma/zod-utils";
import axios from 'axios';

const signupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(7),
  language: z.string().optional(),
  token: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return;
  }

  if (process.env.NEXT_PUBLIC_DISABLE_SIGNUP === "true") {
    res.status(403).json({ message: "Signup is disabled" });
    return;
  }

  const data = req.body;
  const { email, password, language, token } = signupSchema.parse(data);

  const username = slugify(data.username);
  const userEmail = email.toLowerCase();
  const supabase = createClientComponentClient();
  const VIDEO_SERVICE_URL = process.env.NEXT_PUBLIC_VIDEO_SERVICE

  if (!username) {
    res.status(422).json({ message: "Invalid username" });
    return;
  }

  const getVideoCloneApi = async (token: string) => {
    try {
      let res = await axios.post(`${VIDEO_SERVICE_URL}/users/api_key`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      console.log("api key: ", res)
      if (res && res.data) return res.data
      else return null
    } catch (_err) {
      console.log("error on getting api: ")
      return null
    }
  }

  const getVideoCloneToken = async (email: string, password: string) => {
    try {
      let res = await axios.post(`${VIDEO_SERVICE_URL}/registry`, {
        email,
        password
      });
      console.log("video: ", res.data)
      if (res && res.data) {
        let _res = await getVideoCloneApi(res.data.access_token || '')
        if (_res && _res.api_key) return _res.api_key
        else return null
      }
      else return null
    } catch (_err) {
      console.log("error: ")
      return null
    }
  }

  // There is an existingUser if the username matches
  // OR if the email matches AND either the email is verified
  // or both username and password are set
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        {
          AND: [
            { email: userEmail },
            {
              OR: [
                { emailVerified: { not: null } },
                {
                  AND: [{ password: { not: null } }, { username: { not: null } }],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  if (existingUser) {
    let message: string =
      existingUser.email !== userEmail ? "Username already taken" : "Email address is already registered";

    if (!existingUser.videoCloneToken) {
      let api_key = await getVideoCloneToken(userEmail, password);
      console.log("video clone api: ", api_key)
      if (api_key) {
        try {
          await prisma.user.update({
            where: {
              email: userEmail,
            },
            data: {
              videoCloneToken: api_key,
            },
          });
        } catch (_e) {

        }
      }
    }

    return res.status(409).json({ message });
  }

  const hashedPassword = await hashPassword(password);

  let videoToken = await getVideoCloneToken(userEmail, password);
  console.log("video clone api: ", videoToken)

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      username,
      password: hashedPassword,
      emailVerified: new Date(Date.now()),
      identityProvider: IdentityProvider.CAL,
      videoCloneToken: videoToken
    },
    create: {
      username,
      email: userEmail,
      password: hashedPassword,
      identityProvider: IdentityProvider.CAL,
      videoCloneToken: videoToken
    },
  });

  if (token) {
    const foundToken = await prisma.verificationToken.findFirst({
      where: {
        token,
      },
    });

    if (!foundToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    if (dayjs(foundToken?.expires).isBefore(dayjs())) {
      return res.status(401).json({ message: "Token expired" });
    }

    if (foundToken.teamId) {
      const team = await prisma.team.findUnique({
        where: {
          id: foundToken.teamId,
        },
      });

      if (team) {
        const teamMetadata = teamMetadataSchema.parse(team?.metadata);
        if (teamMetadata?.isOrganization) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              organizationId: team.id,
            },
          });
        }

        const membership = await prisma.membership.update({
          where: {
            userId_teamId: { userId: user.id, teamId: team.id },
          },
          data: {
            accepted: true,
          },
        });
        closeComUpsertTeamUser(team, user, membership.role);

        // Accept any child team invites for orgs.
        if (team.parentId) {
          // Join ORG
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              organizationId: team.parentId,
            },
          });

          /** We do a membership update twice so we can join the ORG invite if the user is invited to a team witin a ORG. */
          await prisma.membership.updateMany({
            where: {
              userId: user.id,
              team: {
                id: team.parentId,
              },
              accepted: false,
            },
            data: {
              accepted: true,
            },
          });

          // Join any other invites
          await prisma.membership.updateMany({
            where: {
              userId: user.id,
              team: {
                parentId: team.parentId,
              },
              accepted: false,
            },
            data: {
              accepted: true,
            },
          });
        }
      }
    }

    // Cleanup token after use
    await prisma.verificationToken.delete({
      where: {
        id: foundToken.id,
      },
    });
  }

  await sendEmailVerification({
    email: userEmail,
    username,
    language,
  });

  // create supabase signup
  await supabase.auth.signUp({
    email,
    password,
  });

  res.status(201).json({ message: "Created user" });
}
