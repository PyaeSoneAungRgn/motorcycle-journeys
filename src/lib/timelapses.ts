export type TimeLapseItem = {
  title: string;
  file: string;
  poster: string;
  duration: string;
  note: string;
  alt: string;
};

export type HomeTimeLapseItem = TimeLapseItem & {
  rideId: string;
  rideTitle: string;
};
