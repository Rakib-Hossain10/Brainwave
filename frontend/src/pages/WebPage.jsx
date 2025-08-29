import React from 'react'
import Header from '../components/Webpage/Header'
import Hero from '../components/Webpage/Hero'
import Services from '../components/Webpage/Services'
import Footer from '../components/Webpage/Footer'

const WebPage = () => {
  return (
   <>
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">

        <Header />
        <Hero />
        <Services />
        <Footer />

      </div>
   
   
   </>
  )
}

export default WebPage