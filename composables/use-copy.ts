import copy from "copy-to-clipboard";

export const useCopy = () => {
  const message = useMessage();
  const handleCopy = (val?: string) => {
    const res = copy(val || "");
    if (res) {
      message.success("复制成功");
    } else {
      message.error("复制失败");
    }
  };
  return handleCopy;
};
