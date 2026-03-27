import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show or hide the button based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Cleanup function removeing the event listener when the component unmounts
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Wrapper>
            {isVisible && (
                <div className="top-btn" onClick={scrollToTop}>
                    <FaArrowUp className="top-btn--icon" />
                </div >
            )}
        </Wrapper>
    );
};

const Wrapper = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .top-btn{
    font-size: 1.5rem;
    width: 3rem;
    height:3rem;
    color: #fff;
    background-color: green;
    box-shadow: yellow;
    border-radius: 50%;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &--icon {
      animation: gototop 1.2s linear infinite alternate-reverse;
    }

    @keyframes gototop {
      0% {
        transform: translateY(-0.2rem);
      }
      100% {
        transform: translateY(0.5rem);
      }
    }
  }

`;


export default BackToTop;

