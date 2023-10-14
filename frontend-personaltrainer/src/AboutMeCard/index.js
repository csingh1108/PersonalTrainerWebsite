import React from 'react';
import ProfileImage from '../Images/WebpageBackgrounds/PersonalTrainerImg.webp';
import '../index.css'

const AboutMeCard = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div className="profile-image-container">
                        <img src={ProfileImage} alt="Profile" className="profile-image" />
                    </div>
                </div>
                <div className="col-md-8 textContainerStyles">
                    <h2>John Garcia</h2>
                    <p>
                        Hi, I'm John, your dedicated personal trainer on a mission to help you achieve your fitness goals and transform your life. With over 10 years of experience in the fitness industry, I have the knowledge and passion to guide you on your journey to a healthier and stronger you.
                    </p>
                    <p>
                        My training philosophy is simple yet effective: personalized workouts, nutrition guidance, and unwavering support. Whether you're looking to lose weight, build muscle, or improve your overall well-being, I'll tailor a fitness plan that suits your needs and fits into your busy lifestyle.
                    </p>
                    <p>
                        I believe that fitness is not just about physical strength but also mental resilience. Together, we'll push your limits, break through barriers, and discover the best version of yourself. I'm here to motivate, educate, and inspire you every step of the way.
                    </p>
                    <p>
                        When I'm not in the gym, you can find me exploring the great outdoors, experimenting with new healthy recipes, and staying up-to-date with the latest fitness trends. I can't wait to embark on this fitness journey with you!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutMeCard;
