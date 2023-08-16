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
  showToast,
} from "@calcom/ui";
import { MoreHorizontal, Trash2, ShoppingCart } from "@calcom/ui/components/icon";

function CustomExpertTable() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  const mockupData = [
    {
      fullname: "Expert 1",
      token_amount: 200,
      token_price: 5,
    },
    {
      fullname: "Expert 2",
      token_amount: 200,
      token_price: 5,
    },
    {
      fullname: "Expert 3",
      token_amount: 0,
      token_price: 5,
    },
    {
      fullname: "Expert 4",
      token_amount: 0,
      token_price: 5,
    },
    {
      fullname: "Expert 5",
      token_amount: 200,
      token_price: 5,
    },
    {
      fullname: "Expert 6",
      token_amount: 200,
      token_price: 5,
    },
  ];

  const columns = ["Expert", "Tokens amount", "Token price", ""];

  return (
    <table className="w-2/3 border-collapse">
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
        {mockupData.map((data) => (
          <tr key={data.fullname}>
            <td className="px-4 py-2">
              <div className="flex items-center">
                <Avatar className="mr-2" alt="Nameless" size="sm" imageSrc="" />
                {data.fullname}
              </div>
            </td>
            <td className="px-4 py-2">{data.token_amount}</td>
            <td className="px-4 py-2">{data.token_price}</td>
            <td className="px-4 py-2">
              <ButtonGroup combined>
                {true && (
                  <>
                    <Tooltip content={t("buy_expert_tokens")}>
                      <Button
                        data-testid="preview-link-button"
                        color="secondary"
                        target="_blank"
                        variant="icon"
                        href=""
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
                          disabled={data.token_amount === 0}
                          StartIcon={Trash2}
                          onClick={() => showToast(t("remove"), "error")}>
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
  );
}

export default CustomExpertTable;
