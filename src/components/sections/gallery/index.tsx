import React, { FC, Fragment, useEffect, useState } from "react";
import { PageProps } from "../../../../pages/[race]/[section]";
import { HttpError, useList } from "@pankod/refine-core";
import { Box } from "@pankod/refine-mui";
import { nhost } from "../../../utilites/nhost";
import { Image as ImageGallery, Gallery } from "react-grid-gallery";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const resource = "photo_gallery";
const fields = {
  fields: [
    "id",
    "title",
    "id_homepage",
    {
      photo_gallery_images: ["id_file", "id", "title"],
    },
  ],
};

const resourceImages = "photo_gallery_images";
const fieldsImages = {
  fields: ["id", "title", "id_file"],
};
interface IPhotoGallery {
  title: string;
  id_file: string;
  id_photo_gallery: string;
}
interface IGallery {
  id: string;
  title: string;
  id_homepage: string;
  photo_gallery_images: IPhotoGallery[];
}
interface CustomImage extends ImageGallery {
  categoryId: string;
  bigSrc: string;
}
const CustomGallery: FC<PageProps> = (props) => {
  const { race } = props;
  const { homepageId } = race;
  const [index, setIndex] = useState(0);

  const [images, setImages] = useState<CustomImage[][] | undefined>([]);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data, isLoading } = useList<IGallery, HttpError>({
    resource: resource,
    metaData: fields,
    config: {
      filters: [
        {
          field: "id_homepage",
          operator: "eq",
          value: homepageId,
        },
      ],
    },
  });

  useEffect(() => {
    const imageGallery = new Array();
    data?.data.map((item, index) => {
      imageGallery[index] = new Array();
      return item.photo_gallery_images.map((img) => {
        imageGallery[index].push({
          src: nhost.storage.getPublicUrl({ fileId: img.id_file, width: 400 }),
          categoryId: item.id,
          bigSrc: nhost.storage.getPublicUrl({
            fileId: img.id_file,
            width: 1000,
          }),
        });
      });
    });
    if (imageGallery) setImages(imageGallery);
  }, [data]);

  const handleCategory = (index: number, item: CustomImage) => {
    setCategory(item.categoryId);
    setIndex(index);
    setShow(true);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  if (isLoading) return <Box>Loading ...</Box>;
  return (
    <Box>
      <ImagesComponent
        onClose={handleClose}
        category={category}
        show={show}
        indexProps={index}
      />
      {data?.data.map((item, index) => (
        <Fragment key={item.title}>
          <Box sx={{ paddingTop: { xs: 5, lg: 5 } }}>
            <Box
              sx={{
                backgroundColor: "#ff9f29",
                width: "fit-content",
                paddingX: 2,
                paddingY: 1.5,
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Box>
          </Box>
          <Box sx={{ paddingX: 0, paddingTop: 3 }}>
            {images && (
              <Gallery
                onClick={handleCategory}
                images={images[index] as CustomImage[]}
                enableImageSelection={false}
              />
            )}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
};
interface ImagesComponent {
  category: string | undefined;
  indexProps: number;
  onClose: () => void;
  show: boolean;
}
const ImagesComponent: FC<ImagesComponent> = ({
  category,
  onClose,
  show,
  indexProps = 0,
}) => {
  const [images, setImages] = useState<SlideImage[] | undefined>([]);
  console.log(show, indexProps);
  const { data, isLoading } = useList<IPhotoGallery, HttpError>({
    resource: resourceImages,
    metaData: fieldsImages,
    config: {
      filters: [
        {
          field: "id_photo_gallery",
          operator: "eq",
          value: category,
        },
      ],
    },
  });

  useEffect(() => {
    const images = data?.data?.map((img) => {
      return {
        srcBig: nhost.storage.getPublicUrl({
          fileId: img.id_file,
          width: 1000,
        }),
        src: nhost.storage.getPublicUrl({
          fileId: img.id_file,
          width: 500,
        }),
        loading: "lazy",
      } as SlideImage;
    });
    setImages(images);
  }, [data?.data]);

  if (!images || isLoading) return <Box>Loading ...</Box>;

  return (
    <>
      <Lightbox
        close={onClose}
        open={show}
        index={indexProps}
        slides={images}
        render={{ slide: NextJsImage }}
      />
    </>
  );
};
const NextJsImage = (image: any, offset: number, rect: any) => {
  const width = Math.round(
    Math.min(rect.width, (rect.height / image.height) * image.width)
  );
  const height = Math.round(
    Math.min(rect.height, (rect.width / image.width) * image.height)
  );

  return (
    <div style={{ position: "relative", width, height }}>
      <img src={image.srcBig} alt={""} />
    </div>
  );
};
export default CustomGallery;
