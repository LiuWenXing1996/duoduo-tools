export type ImgCutResultItem = {
  imgDataUrl: string;
  row: number;
  col: number;
};

export const imgCut = async (params: {
  imgDataUrl: string;
  row: number;
  col: number;
}): Promise<ImgCutResultItem[]> => {
  const results: ImgCutResultItem[] = [];
  const { imgDataUrl, row: _row, col: _col } = params;
  const row = _row && _row > 0 ? _row : 1;
  const col = _col && _col > 0 ? _col : 1;
  if (imgDataUrl) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const imgRect = await getImgRect(imgDataUrl);
    const imgWidth = imgRect.width;
    const imgHeight = imgRect.height;
    const img = imgRect.img;
    if (imgHeight > 0 && imgWidth > 0) {
      const wPiece = Math.floor(imgWidth / col);
      const hPiece = Math.floor(imgHeight / row);
      canvas.width = wPiece;
      canvas.height = hPiece;

      for (let r = 0; r < row; r++) {
        for (let c = 0; c < col; c++) {
          ctx?.drawImage(
            img,
            c * wPiece,
            r * hPiece,
            wPiece,
            hPiece,
            0,
            0,
            wPiece,
            hPiece
          );
          results.push({
            imgDataUrl: canvas.toDataURL(),
            row: r + 1,
            col: c + 1,
          });
        }
      }
    }
  }

  return results;
};

export const getImgRect = (
  imgDataUrl: string
): Promise<{
  width: number;
  height: number;
  img: HTMLImageElement;
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgDataUrl;
    img.onload = function () {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        img: img,
      });
    };
    img.onerror = function (...rest) {
      reject(rest);
    };
  });
};
