from diplom_backend.util.xnet import XNet
import torch
from diplom_backend.service.preprocess import preprocess
import SimpleITK as sitk



def batch_generator(X, batch_size):
    size = int(len(X) / batch_size)
    ost = len(X) % batch_size
    for i in range(size):
        yield X[ i *batch_size: ( i +1 ) *batch_size]

    if ost != 0:
        yield X[size *batch_size:]

def run_model(ct):
    print('start recognizing')

    X = preprocess(ct)
    print('ct preprocessed')
    Y = get_result_model(X)
    return Y



def get_result_model(X):

    model = torch.load('/home/ytka/workspace/diplom/util_for_app/xnet_model_2_84_91.pth')
    Y = None

    BATCH_SIZE = 5
    for x in batch_generator(X, BATCH_SIZE):
        ans = model(x).cpu().detach()
        ans = torch.where(ans > 0.5, 1, 0)
        if Y == None:
            Y = ans
        else:
            Y = torch.cat((Y, ans), 0)

    Y = torch.squeeze(Y, 1)

    return Y
