from diplom_backend.util.xnet import XNet
import torch
from diplom_backend.service.preprocess import preprocess
from diplom_backend.util.device import Device
from diplom_backend.util.xnet import XNet



def batch_generator(X, batch_size):
    size = int(len(X) / batch_size)
    ost = len(X) % batch_size
    for i in range(size):
        yield X[ i *batch_size: ( i +1 ) *batch_size]

    if ost != 0:
        yield X[size *batch_size:]

def run_model(ct):
    print('start recognizing')

    device = Device().get_device()
    X = ct.to(device)
    print('ct preprocessed')
    Y = get_result_model(X)
    return Y



def get_result_model(X):

    device = Device().get_device()
    model = XNet()
    model.load_state_dict(torch.load('/home/ytka/workspace/diplom/util_for_app/xnet_dict.pt', map_location=torch.device('cpu')))
    model = model.to(device)
    Y = None

    BATCH_SIZE = 5
    for x in batch_generator(X, BATCH_SIZE):
        ans = model(x)
        # ans = model(x).cpu().detach()
        ans = torch.where(ans > 0.5, 1, 0)
        if Y == None:
            Y = ans
        else:
            Y = torch.cat((Y, ans), 0)

    Y = torch.squeeze(Y, 1)

    return Y
