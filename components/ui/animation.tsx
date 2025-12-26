import { useGSAP } from '@gsap/react'
import React from 'react'
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from 'react-responsive'



gsap.registerPlugin(ScrollTrigger);
const Animation = () => {

const isMbile = useMediaQuery({maxWidth : 767})
const idLargerScreen = useMediaQuery({ minWidth : 1024})
// When using max-width, styles stop being applied once the viewport width exceeds the specified value.
//  In contrast, min-width styles start being applied when the viewport width is equal to or greater than the specified value and continue to apply as the screen gets larger, unless overridden by another rule.

useGSAP(() =>{
    const start = isMbile? "top 20%" : "top top"
    const yValue = idLargerScreen ? "0" : 100

    const maskTimeLine = gsap.timeline({
        scrollTrigger: {
            trigger: "#art",
            start,  
            end: "bottom center",
            scrub: 1,
            anticipatePin: 1,
            pin: true  
            // pin: true = "Freeze this element while I animate it during scroll"
        }
    })

    .to(".masked-img", {
        scale:1.3, maskPosition: "center", maskSize: "400%",
        duration: 1, ease: "power1.inOut"
    })
    
},[])


    return (
        <div id="art">
                    <div className='cocktail-img'>
                        <img src="/under.png" alt="cocktail"
                            className='abs-center masked-img size-full object-contain' />
            </div>
        </div>
    )
}

export default Animation
