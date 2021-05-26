import cv2
import torch


def preprocess(ct):
    X = [preprocess_slice(x) for x in ct]
    X = torch.tensor(X)
    X = torch.unsqueeze(X, 1)

    return X


def preprocess_slice(img):
    size = (160, 160)
    method = cv2.INTER_AREA

    if img.shape[0] < size[0]:
        method = cv2.INTER_CUBIC

    img_resized = cv2.resize(img, size, interpolation = method)
    norm_img = cv2.normalize(img_resized, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)

    return norm_img