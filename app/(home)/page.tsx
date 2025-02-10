"use client"
import Image from "next/image";

export default  function Home() {
  

  return (

    <>
      <div className="bg-[#a0a1a3] justify-items-center w-full h-full">
        <br />
        <br />
        <Image src="/Azera Logo 01.png" alt="Azera Motor's Logo" width={200} height={50} style={{ width: 'auto', height: 'auto' }} priority={true} />

      </div> 
    </>


    
  );
}
