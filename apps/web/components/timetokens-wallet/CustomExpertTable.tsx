import Link from "next/link";
import React from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import {
  Avatar,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  Input,
  EmptyScreen,
} from "@calcom/ui";
import { ExternalLink, MoreHorizontal, Trash2, ShoppingCart, Newspaper } from "@calcom/ui/components/icon";

export type ExpertDataType = {
  userId: number;
  username: string;
  fullname: string;
  avatar: string;
  expert_token_amount: number;
  token_amount: number;
  token_price: number;
  added: boolean;
  buy_amount: number;
};

interface CustomExpertTableProps {
  expertsData: ExpertDataType[];
  columns: string[];
  handleBuyEvent: (emitterId: number, tokens: number) => void;
  handleRemoveEvent: (emitterId: number) => void;
}

function CustomExpertTable(props: CustomExpertTableProps) {
  const { t } = useLocale();

  const { expertsData, columns, handleBuyEvent, handleRemoveEvent } = props;

  // const data: number[] = [];
  // for (let i = 0; i < expertsData.length; i++) {
  //   data.push(10);
  // }

  // const [tokensAmount, setTokensAmount] = useState<number[]>([]);

  // useEffect(() => {
  //   console.log('=====================')
  //   setTokensAmount(data);
  // }, [])

  return (
    <div>
      {expertsData.length === 0 && (
        <div className="w-full px-1 sm:px-4">
          <EmptyScreen
            Icon={Newspaper}
            headline={t("no_expert_data")}
            description={t("no_expert_data_description")}
          />
        </div>
      )}
      {expertsData.length > 0 && (
        <table className="w-full border-collapse text-[.5rem] sm:text-sm">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th className="px-1 text-left sm:px-4 sm:py-2" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expertsData.map((data: ExpertDataType, index: number) => (
              <tr key={data.fullname} className="">
                <td className="px-1 sm:px-4 sm:py-2">
                  <div className="flex items-center overflow-hidden whitespace-nowrap">
                    <Avatar
                      className="border-pink/30 mr-1 hidden rounded-full border sm:mr-2 sm:block"
                      alt={data.fullname || "unknown"}
                      size="md"
                      imageSrc={data.avatar}
                    />
                    {data.fullname}
                    <Link href={`/${data.username}`} target="_blank">
                      <Button variant="icon" color="minimal" StartIcon={ExternalLink} />
                    </Link>
                  </div>
                </td>
                <td className="px-1 sm:px-4 sm:py-2">{data.expert_token_amount}</td>
                <td className="px-1 sm:px-4 sm:py-2">{data.token_amount}</td>
                <td className="px-1 sm:px-4 sm:py-2">{data.token_price}</td>
                <td className="flex justify-end px-1 sm:px-4 sm:py-2">
                  <ButtonGroup combined>
                    <Input
                      type="number"
                      min={Math.min(1, data.expert_token_amount || 1)}
                      max={data.expert_token_amount}
                      disabled={data.expert_token_amount === 0}
                      onChange={(e) => {
                        const val = Number(e.target?.value);
                        if (val > data.expert_token_amount) return false;

                        // const tokensAmountData = tokensAmount;
                        // tokensAmountData[index] = val;
                        // setTokensAmount(tokensAmountData);
                        data.buy_amount = val;
                      }}
                      className="border-default w-10 rounded-none text-[.5rem] [appearance:textfield] sm:w-24 sm:text-sm"
                      defaultValue={Math.min(10, data.expert_token_amount)}
                    />
                    {true && (
                      <>
                        <Tooltip content={t("buy_expert_tokens")}>
                          <Button
                            className="hidden text-[.5rem] sm:text-sm md:block"
                            data-testid="preview-link-button"
                            color="secondary"
                            target="_blank"
                            variant="icon"
                            disabled={data.expert_token_amount === 0}
                            onClick={() => {
                              handleBuyEvent(data.userId, data.buy_amount);
                            }}
                            StartIcon={ShoppingCart}
                          />
                        </Tooltip>
                      </>
                    )}
                    <Dropdown modal={false}>
                      <DropdownMenuTrigger asChild data-testid="event-type-options-">
                        <Button
                          type="button"
                          variant="icon"
                          color="secondary"
                          StartIcon={MoreHorizontal}
                          className="ltr:radix-state-open:rounded-r-md rtl:radix-state-open:rounded-l-md p-1"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <DropdownItem
                            type="button"
                            className="md:hidden"
                            childrenClassName="text-[.5rem] sm:text-sm"
                            data-testid="buy-tokens-of-expert"
                            disabled={data.expert_token_amount === 0}
                            StartIcon={ShoppingCart}
                            onClick={() => {
                              handleBuyEvent(data.userId, data.buy_amount);
                            }}>
                            {t("buy")}
                          </DropdownItem>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DropdownItem
                            type="button"
                            childrenClassName="text-[.5rem] sm:text-sm"
                            data-testid="remove-expert"
                            disabled={data.token_amount !== 0}
                            StartIcon={Trash2}
                            onClick={() => handleRemoveEvent(data.userId)}>
                            {t("remove")}
                          </DropdownItem>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </Dropdown>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomExpertTable;
