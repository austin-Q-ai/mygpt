import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

const howDoesItWorkContents = [
    {
        "header": "Registration",
        "footer": "Sign in on the platform",
    },
    {
        "header": "Getting started",
        "footer": "Fill all fields of the getting started",
    },
    {
        "header": "Dashboard",
        "footer": "Navigate between menus using the cube",
    },
    {
        "header": "Events Dashboard",
        "footer": "Add a new event type, Delete event type and Edit event type",
    },
    {
        "header": "Book Meeting",
        "footer": "Cancel booking, Reschedule booking, Request Reschedule, Edit location",
    },
    {
        "header": "Timetokens Wallet",
        "footer": "Add expert timetoken, Buy timetoken, View expert profile, Remove expert timetoken and Change Timetoken Price",
    },
    {
        "header": "Time Availability",
        "footer": "Add a new availability, Edit availability, Delete availability, Duplicate availability",
    },
    {
        "header": "Club deal",
        "footer": "Add a new club deal, Edit club deal, Delete club deal, Preview club deal, Invite club deal member",
    },
    {
        "header": "Apps",
        "footer": "Add a new app, Delete app",
    },


]

export default function HowDoesItWork() {
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
                                <p className='text-2xl font-bold text-center text-pink'>{item.header}</p>
                            </div>
                            <img className='my-auto' src={`/app-how-does-it-work/${index + 1}.png`} />
                            <p className='mt-6 text-xl text-center mb-14 text-pink'>{item.footer}</p>
                        </div>
                    </SwiperSlide>

                )}
            </Swiper >
        </>
    )
}