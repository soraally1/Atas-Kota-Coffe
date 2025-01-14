import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <section id="footer" className="w-screen min-h-[50vh] top-0 left-0 bg-[#E6D5B7]">
           <div className="py-16 pl-8 pr-10 md:pl-32 md:pr-40 flex xl:flex-row md:flex-row flex-col justify-between">
            {/* Logo and description */}
            <div className="flex flex-col xl:w-1/5 sm:w-full">
                <div className="w-full h-24 bg-LogoFooter bg-contain bg-no-repeat bg-center">
                </div>
                <p className="text-gray-600 font-sans font-[500] text-left text-[16px] md:text-xl pb-4">
                Nikmati setiap momen dengan secangkir kopi terbaik dari cafe Atas Kota. Tempat di mana cerita dimulai dan kenangan tercipta. Kopi, cinta, dan kehangatan untuk hari Anda
                </p>
            </div>
            {/* Service */}
            <div className="flex flex-col gap-4">
                <h1 className="font-sans font-[700] text-2xl underline underline-offset-2">
                    Services
                </h1>
                <ul className="flex flex-col gap-2">
                    <li className="xl:text-left md:text-left text-center"> 
                        <a href="/#Top" className="font-sans font-[600] text-[24px]">Home</a>
                    </li>
                    <li className="xl:text-left md:text-left text-center">
                        <Link to="/menu" className="font-sans font-[600] text-[24px]">Menu</Link>
                    </li>
                    <li className="xl:text-left md:text-left text-center">
                        <a href="/#Location" className="font-sans font-[600] text-[24px]">Location</a>
                    </li>
                    <li className="xl:text-left md:text-left text-center">
                        <a href="/#gallery" className="font-sans font-[600] text-[24px]">Gallery</a>
                    </li>
                </ul>
            </div>
            {/* Links */}
            <div className="flex flex-col gap-4">
                <h1 className="font-sans font-[700] text-2xl underline underline-offset-2">
                    Follow Us
                </h1>
                <ul className="flex flex-col items-center md:items-start gap-2">
                    <li className="xl:text-left sm:text-center">
                        <a href="https://www.instagram.com/ataskota?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="font-sans font-[600] text-[24px] flex text-center gap-2">
                            Facebook
                        </a>
                    </li>
                    <li className="xl:text-left md:text-left text-center">
                        <a href="https://www.instagram.com/ataskota?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="font-sans font-[600] text-[24px] flex items-center gap-2">
                            Tiktok
                        </a>
                    </li>
                    <li className="xl:text-left md:text-left text-center">
                        <a href="https://www.instagram.com/ataskota?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="font-sans font-[600] text-[24px] flex items-center gap-2">
                            Instagram
                        </a>
                    </li>
                    <li className="xl:text-left md:text-left text-center">
                        <a href="https://www.instagram.com/ataskota?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="font-sans font-[600] text-[24px] flex items-center gap-2">
                            Twitter
                        </a>
                    </li>
                </ul>
            </div>  
            {/* Contact us */}
            <div className="flex flex-col gap-6">
                <h1 className="font-sans font-[700] text-2xl underline underline-offset-2">
                    Contact Us
                </h1>
                
                {/* Phone number */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-PhoneIcon bg-contain bg-no-repeat bg-center"></div>
                    <span className="font-sans font-[600] text-[24px]">088218425542</span>
                </div>

                {/* Contact Form */}
                <form className="flex flex-col gap-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full px-4 py-3 rounded-lg bg-white font-sans"
                    />
                    <textarea 
                        placeholder="Message" 
                        className="w-full px-4 py-3 rounded-lg bg-white font-sans min-h-[120px] resize-none"
                    />
                    <button 
                        type="submit" 
                        className="w-full py-3 rounded-lg bg-[#A39280] text-white font-sans font-[600] text-xl hover:bg-[#8a7b6b] transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
           </div>
        </section>
    )
}

export default Footer;