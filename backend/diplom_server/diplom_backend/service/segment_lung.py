import numpy as  np
from lungmask import mask as segmentator

def get_volume_lesion(mask_lung, mask_lesion):
    unique_value_lung = np.unique(mask_lung, return_counts=True)[1]
    count_pixel_lung = unique_value_lung[1] + unique_value_lung[2]

    uniq_val_mask = np.unique(mask_lesion, return_counts=True)[1]
    count_pixel_lesion = uniq_val_mask[1]

    volume = (count_pixel_lesion / count_pixel_lung) * 100
    return volume

def segmentation_lung(ct):
    segmentation = segmentator.apply(ct)
    return segmentation
