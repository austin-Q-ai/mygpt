import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLocale } from "@calcom/lib/hooks/useLocale";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

const howDoesItWorkContents = [
    {
        "header": "registration",
        "footer": "sign_in_on_the_platform",
    },
    {
        "header": "getting_started",
        "footer": "fill_all_fields_of_the_getting_started",
    },
    {
        "header": "dashboard",
        "footer": "navigate_between_menu_using_cube",
    },
    {
        "header": "event_types_page_title",
        "footer": "add_a_new_event_type_delete_event_type_and_edit_event_type",
    },
    {
        "header": "bookings",
        "footer": "cancel_booking_reschedule_booking_request_reschedule_edit_location",
    },
    {
        "header": "timetokens_wallet",
        "footer": "add_expert_timetoken_buy_timetoken_view_expert_profile_remove_expert_timetoken_and_change_timetoken_price",
    },
    {
        "header": "availability",
        "footer": "add_a_new_availability_edit_availability_delete_availability_duplicate_availability",
    },
    {
        "header": "teams",
        "footer": "add_a_new_club_deal_edit_club_deal_delete_club_deal_preview_club_deal_invite_club_deal_member",
    },
    {
        "header": "apps",
        "footer": "add_a_new_app_delete_app",
    },
]

export default function HowDoesItWork() {
    const { t } = useLocale();
    return (
        <>
            <Swiper pagination={true} modules={[Pagination]} className="w-full h-full" style={{
                //@ts-ignore
                "--swiper-pagination-color": "#6D278E",
                "--swiper-pagination-bullet-inactive-color": "#D7C9E0",
                "--swiper-pagination-bullet-inactive-opacity": "1",
                "--swiper-pagination-bullet-size": "20px",
                "--swiper-pagination-bullet-horizontal-gap": "6px"
            }}>
                {howDoesItWorkContents.map((item, index) =>

                    <SwiperSlide className='!h-auto'>
                        <div className='flex flex-col items-center justify-center h-full'>
                            <div className='flex items-center mb-6'>
                                <div className='w-6 h-6 mr-4 text-center text-white rounded-full bg-pink'>{index + 1}</div>
                                <p className='text-2xl font-bold text-center text-pink'>{t(item.header)}</p>
                            </div>
                            <img className='my-auto' src={`/app-how-does-it-work/${index + 1}.png`} />
                            <p className='mt-6 text-xl text-center mb-14 text-pink'>{t(item.footer)}</p>
                        </div>
                    </SwiperSlide>

                )}
            </Swiper >
        </>
    )
}