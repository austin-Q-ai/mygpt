import React, { useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
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
import { MoreHorizontal, Trash2, ShoppingCart, Newspaper } from "@calcom/ui/components/icon";

export interface ExpertDataType {
  userId: number;
  fullname: string;
  expert_token_amount: number;
  token_amount: number;
  token_price: number;
  added: boolean;
}

interface CustomExpertTableProps {
  expertsData: ExpertData[];
  columns: string[];
  handleBuyEvent: (emitterId: number, tokens: number) => void;
  handleRemoveEvent: (emitterId: number) => void;
}

function CustomExpertTable(props: CustomExpertTableProps) {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  const { expertsData, columns, handleBuyEvent, handleRemoveEvent } = props;

  const data: number[] = [];
  for (let i = 0; i < expertsData.length; i++) {
    data.push(10);
  }

  const [tokensAmount, setTokensAmount] = useState<number[]>(data);

  return (
    <div>
      {expertsData.length === 0 && (
        <div className="w-full px-4 lg:w-2/3">
          <EmptyScreen
            Icon={Newspaper}
            headline={t("no_expert_data")}
            description={t("no_expert_data_description")}
          />
        </div>
      )}
      {expertsData.length > 0 && (
        <table className="w-full border-collapse lg:w-2/3">
          <thead>
            <tr>
              {columns.map((column) => (
                <th className="px-4 py-2 text-left" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expertsData.map((data, index) => (
              <tr key={data.fullname} className="">
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <Avatar className="mr-2" alt="Nameless" size="sm" imageSrc="" />
                    {data.fullname}
                  </div>
                </td>
                <td className="px-4 py-2">{data.token_amount}</td>
                <td className="px-4 py-2">{data.token_price}</td>
                <td className="flex justify-end px-4 py-2">
                  <ButtonGroup combined>
                    <Input
                      type="number"
                      min={1}
                      max={data.expert_token_amount}
                      disabled={false}
                      onChange={(e) => {
                        const val = Number(e.target?.value);
                        const data = tokensAmount;
                        data[index] = val;
                        setTokensAmount(data);
                      }}
                      className="max-w-24 border-default text-sm [appearance:textfield]"
                      defaultValue={10}
                    />
                    {true && (
                      <>
                        <Tooltip content={t("buy_expert_tokens")}>
                          <Button
                            data-testid="preview-link-button"
                            color="secondary"
                            target="_blank"
                            variant="icon"
                            onClick={() => handleBuyEvent(data.userId, tokensAmount[index])}
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
                          className="ltr:radix-state-open:rounded-r-md rtl:radix-state-open:rounded-l-md"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {true && (
                          <DropdownMenuItem>
                            <DropdownItem
                              type="button"
                              data-testid="event-type-edit-"
                              disabled={data.token_amount !== 0}
                              StartIcon={Trash2}
                              onClick={() => handleRemoveEvent(data.userId)}>
                              {t("remove")}
                            </DropdownItem>
                          </DropdownMenuItem>
                        )}
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
