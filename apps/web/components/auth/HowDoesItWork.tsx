import React from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Pagination } from "swiper/modules";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import { useLocale } from "@calcom/lib/hooks/useLocale";

const howDoesItWorkContents = [
  {
    header: "registration",
    footer: "sign_in_on_the_platform",
  },
  {
    header: "getting_started",
    footer: "fill_all_fields_of_the_getting_started",
  },
  {
    header: "dashboard",
    footer: "navigate_between_menu_using_cube",
  },
  {
    header: "event_types_page_title",
    footer: "add_a_new_event_type_delete_event_type_and_edit_event_type",
  },
  {
    header: "bookings",
    footer: "cancel_booking_reschedule_booking_request_reschedule_edit_location",
  },
  {
    header: "timetokens_wallet",
    footer:
      "add_expert_timetoken_buy_timetoken_view_expert_profile_remove_expert_timetoken_and_change_timetoken_price",
  },
  {
    header: "availability",
    footer: "add_a_new_availability_edit_availability_delete_availability_duplicate_availability",
  },
  {
    header: "teams",
    footer: "add_a_new_club_deal_edit_club_deal_delete_club_deal_preview_club_deal_invite_club_deal_member",
  },
  {
    header: "apps",
    footer: "add_a_new_app_delete_app",
  },
];

export default function HowDoesItWork() {
  const { t } = useLocale();
  return (
    <>
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="h-full w-full"
        style={{
          //@ts-ignore
          "--swiper-pagination-color": "#6D278E",
          "--swiper-pagination-bullet-inactive-color": "#D7C9E0",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-size": "20px",
          "--swiper-pagination-bullet-horizontal-gap": "6px",
        }}>
        {howDoesItWorkContents.map((item, index) => (
          <SwiperSlide className="!h-auto" key={index}>
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-6 flex items-center">
                <div className="bg-pink mr-4 h-6 w-6 rounded-full text-center text-white">{index + 1}</div>
                <p className="text-pink text-center text-2xl font-bold">{t(item.header)}</p>
              </div>
              <img
                className="my-auto"
                alt="how does it work"
                src={`/app-how-does-it-work/${index + 1}.png`}
              />
              <p className="text-pink mb-14 mt-6 text-center text-xl">{t(item.footer)}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
