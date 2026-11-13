export type PhotoCategory = 'All' | 'Alpine' | 'Woodland' | 'Atmospheric';

export interface PhotoItem {
  id: string;
  plateNumber: string;
  title: string;
  location: string;
  year: string;
  category: Exclude<PhotoCategory, 'All'>;
  series: string;
  src: string;
  alt: string;
  aspectClass: string;
  camera: string;
  lens: string;
  exif: string;
  caption: string;
}

export const HERO_PHOTO: PhotoItem = {
  id: 'hero-01',
  plateNumber: 'Plate 00',
  title: 'First Light Over Bernese Oberland',
  location: 'Valais Alps, Switzerland',
  year: '2025',
  category: 'Alpine',
  series: 'Highland Silence',
  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80',
  alt: 'High-altitude alpine ridges bathed in pale dawn light above a sea of morning mist',
  aspectClass: 'aspect-[16/9]',
  camera: 'Hasselblad X2D 100C',
  lens: 'XCD 38mm f/2.5V',
  exif: 'f/8 · 1/250s · ISO 64',
  caption: 'Captured twenty minutes before sunrise at 3,100 meters as alpine mist settled into the glacial valley floor.',
};

export const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: 'gallery-01',
    plateNumber: 'Plate 01',
    title: 'Golden Crest Above the Timberline',
    location: 'Dolomites, Northern Italy',
    year: '2025',
    category: 'Alpine',
    series: 'Highland Silence',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    alt: 'Sunlit mountain ridge rising through warm afternoon haze over evergreen slopes',
    aspectClass: 'aspect-[4/5]',
    camera: 'Leica M11',
    lens: 'Summilux-M 35mm f/1.4',
    exif: 'f/5.6 · 1/500s · ISO 64',
    caption: 'Warm raking light cuts across limestone ridges while lower valleys fall into deep cobalt shadow.',
  },
  {
    id: 'gallery-02',
    plateNumber: 'Plate 02',
    title: 'Cathedral of Old-Growth Canopy',
    location: 'Olympic Peninsula, Washington',
    year: '2024',
    category: 'Woodland',
    series: 'Sylvan Studies',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    alt: 'Shafts of morning sunlight piercing through dense tall forest canopy',
    aspectClass: 'aspect-[3/4]',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 55mm f/2.5V',
    exif: 'f/4 · 1/125s · ISO 100',
    caption: 'Volumetric shafts of coastal light break through Sitka spruce needles after a three-day autumn squall.',
  },
  {
    id: 'gallery-03',
    plateNumber: 'Plate 03',
    title: 'Rain-Washed Fern & Basalt',
    location: 'Hoh Rain Forest, Pacific Northwest',
    year: '2024',
    category: 'Woodland',
    series: 'Sylvan Studies',
    src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=800&q=80',
    alt: 'Deep emerald foliage glistening with rain droplets in soft diffused forest light',
    aspectClass: 'aspect-[2/3]',
    camera: 'Leica SL3',
    lens: 'APO-Summicron 50mm f/2',
    exif: 'f/2.8 · 1/160s · ISO 200',
    caption: 'Quiet botanical study focusing on specular highlights across saturated temperate moss and fern fronds.',
  },
  {
    id: 'gallery-04',
    plateNumber: 'Plate 04',
    title: 'Solstice Horizon at Low Tide',
    location: 'Lofoten Archipelago, Norway',
    year: '2025',
    category: 'Atmospheric',
    series: 'Nordic Nocturne',
    src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80',
    alt: 'Reflective coastal shoreline and tranquil horizon under glowing amber dusk',
    aspectClass: 'aspect-[4/3]',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 28mm f/4P',
    exif: 'f/11 · 1.2s · ISO 64',
    caption: 'A long exposure flattens incoming Arctic swells into a quiet mirror of residual twilight.',
  },
  {
    id: 'gallery-05',
    plateNumber: 'Plate 05',
    title: 'Drift Layer Over Highland Fold',
    location: 'Isle of Skye, Scotland',
    year: '2024',
    category: 'Atmospheric',
    series: 'Nordic Nocturne',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    alt: 'Rolling mountain ridges veiled in soft morning fog and layered cloud banks',
    aspectClass: 'aspect-[3/4]',
    camera: 'Leica M11',
    lens: 'APO-Summicron 75mm f/2',
    exif: 'f/5.6 · 1/320s · ISO 64',
    caption: 'Compressed telephoto perspective isolates the rhythmic contours of ridges emerging from Atlantic fog.',
  },
  {
    id: 'gallery-06',
    plateNumber: 'Plate 06',
    title: 'Bridge Through the Amber Glade',
    location: 'Black Forest, Baden-Württemberg',
    year: '2024',
    category: 'Woodland',
    series: 'Sylvan Studies',
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
    alt: 'Quiet timber path receding into a sunlit moss-covered woodland clearing',
    aspectClass: 'aspect-[4/5]',
    camera: 'Leica M11',
    lens: 'Summilux-M 50mm f/1.4',
    exif: 'f/4 · 1/200s · ISO 100',
    caption: 'Late-afternoon light softens the weathered timber crossing where beech and pine canopies meet.',
  },
];

export const FEATURED_SERIES_PHOTOS: PhotoItem[] = [
  {
    ...HERO_PHOTO,
    id: 'series-00',
    plateNumber: 'Series I · 01',
  },
  {
    ...GALLERY_PHOTOS[3],
    id: 'series-01',
    plateNumber: 'Series I · 02',
  },
  {
    ...GALLERY_PHOTOS[4],
    id: 'series-02',
    plateNumber: 'Series I · 03',
  },
  {
    ...GALLERY_PHOTOS[1],
    id: 'series-03',
    plateNumber: 'Series I · 04',
  },
  {
    ...GALLERY_PHOTOS[0],
    id: 'series-04',
    plateNumber: 'Series I · 05',
  },
  {
    ...GALLERY_PHOTOS[5],
    id: 'series-05',
    plateNumber: 'Series I · 06',
  },
];
