import { ResponseValues } from 'axios-hooks';
import { useMemo } from 'react';
import { LoginData } from '../../../../utils/LoginData';
import { useFetch } from '../../../../http';
import { createHeader } from '../../../../utils/http.authed';
import { ChooseImageMetadata } from '../../../../admin/choose-image/choose-image.api';

function isOrientationCorrect(orientation: Orientation): boolean {
  return orientation === Orientation.RO;
}

export enum Orientation {
  RO = 'Horizontal (normal)',
  R270 = 'Rotate 270 CW',
}

type InternalChooseImageMetadata = Array<{
  Orientation: Orientation,
  ImageWidth: number,
  ImageHeight: number,
  FileName: string
}>;

function useChooseImageMetadata(loginData: LoginData, folder: string, file: string): ResponseValues<Array<ChooseImageMetadata>, unknown, unknown> {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<InternalChooseImageMetadata>({
    url: `api/choose_pictures_file_get.php?folder=${folder}&file=${file}&email=${loginData.user}&accesskey=${loginData.auth}`,
  });

  const data = useMemo(() => rawData?.map((o): ChooseImageMetadata => ({
    filename: o.FileName,
    width: isOrientationCorrect(o.Orientation) ? o.ImageWidth : o.ImageHeight,
    height: isOrientationCorrect(o.Orientation) ? o.ImageHeight : o.ImageWidth,
  })), [rawData]);

  return {
    data,
    loading,
    error,
  };
}

export function useChooseImageThumbnailMetadata(loginData: LoginData, folder: string) {
  return useChooseImageMetadata(loginData, folder, 'thumbnails/meta.json');
}

export function useChooseImagePreviewMetadata(loginData: LoginData, folder: string) {
  return useChooseImageMetadata(loginData, folder, 'meta.json');
}

export type AvailableChooseImageData = { folder: string };

export function useAvailableChooseImage(loginData: LoginData): ResponseValues<Array<AvailableChooseImageData>, unknown, unknown> {
  const [data] = useFetch<Array<AvailableChooseImageData>>({
    url: 'api/waitlist-choose_picture_sets_get.php',
    headers: createHeader(loginData),
  });
  return data;
}
