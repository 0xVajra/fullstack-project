import { useWindowSize } from '@/hooks/useWindowSize'
import Image from 'next/image'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Blocks } from '../types'

type Props = {
  slides: Blocks
}

export default function Slider({ slides }: Props) {
  const [loading, setLoading] = useState(true)
  const { isTablet, isMobile } = useWindowSize()

  const onImagesReady = () => {
    setLoading(false)
  }

  const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation={slidesPerView < slides.length}
      pagination={
        slidesPerView < slides.length
          ? {
              clickable: true
            }
          : undefined
      }
      slidesPerView={slidesPerView}
      autoplay
      loop
      //@ts-ignore
      onImagesReady={onImagesReady}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <Image
            src={slide.imgSrc}
            alt={slide.imgAlt}
            width={480}
            height={320}
            style={{
              display: loading ? 'none' : 'block'
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}