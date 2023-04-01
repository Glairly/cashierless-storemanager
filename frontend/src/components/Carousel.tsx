import { Carousel, Image } from "react-bootstrap";

interface CarouselInfo {
  id: number;
  imgSrc: string;
  imgAlt?: string;
  label: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselInfo[];
}

const CarouselWithItems: React.FC<CarouselProps> = ({ items }) => {
  return (
    <Carousel className="rounded mt-4">
      {items.map((item) => (
        <Carousel.Item key={item.id}>
          <Image
            className="d-block w-100 rounded"
            src={item.imgSrc}
            alt={item.imgAlt}
          />
          <Carousel.Caption>
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselWithItems;
