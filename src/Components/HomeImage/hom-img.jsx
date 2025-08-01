import { Carousel } from 'antd';
import './hom-img.css';

const HomeImageCarousel = () => {
  return (
    <div className="homeimg">
      <Carousel autoplay effect="fade">
        <div>
          <img src="/public/pexels-cmrcn-27988858.jpg" alt="Slide 1" />
        </div>
        <div>
          <img src="/public/pexels-arteeem-3095621.jpg" alt="Slide 2" />
        </div>
        <div>
          <img src="/public/pexels-cottonbro-10464472.jpg" alt="Slide 3" />
        </div>
      </Carousel>
    </div>
  );
};

export default HomeImageCarousel;
