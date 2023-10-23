import { SUBSCRIPTION_DATA } from "@calcom/lib/constants"
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ArrowRight, CheckCircle2 } from "@calcom/ui/components/icon";

interface IPriceInfo {
    priceLevel: number
}

const PriceInfo = ({ priceLevel }: IPriceInfo) => {
    const { t } = useLocale();
    const subscription_data = SUBSCRIPTION_DATA[priceLevel]

    const getNextMonth = () => {
        let date = new Date();

        // get the next month's date
        date.setMonth(date.getMonth() + 1);

        // format the date
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();

        return dd + '/' + mm + '/' + yyyy;
    }

    return <div className="flex px-[50px] py-[17px] flex-col justify-center items-center gap-[19px] shrink-0 rounded-2xl border border-solid border-pink my-auto bg-white shadow-[0_4px_19px_0_rgba(109, 39, 142, 0.10)] text-pink">
        <div className="inline-flex px-5 py-[10px] justify-center items-center gap-[10px] rounded-2xl bg-[#6D278E] text-[20px] font-bold text-white -mt-10">Your Plan</div>
        <div className="flex flex-col justify-center items-center gap-[-1px]">
            <p className="text-[30px] font-bold">{t("most_popular")}</p>
            <p className="text-[24px] font-bold">{subscription_data.price.EUR} €/month</p>
        </div>
        <div className="flex flex-col items-start gap-2.5 text-[14px] leading-[17.387px]">
            {subscription_data.advantageList.map((item, key) => <p key={key} className="flex"><CheckCircle2 className="w-5 h-5 text-white " fill="#6d278e" /><span>{t(item)}</span></p>)}
        </div>
        <p className="flex items-center justify-between text-[16px] font-bold">Total {subscription_data.price.EUR}€</p>
        <p className="flex justify-between items-center text-[14px] pb-4">{t("plan_expire_message", { price: subscription_data.price.EUR, date: getNextMonth() })}</p>
    </div>
}

export default PriceInfo