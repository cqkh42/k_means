# not sure where we got the data from
from pathlib import Path
import json
import numpy as np

from numpy.random import default_rng


def make_cluster(mean, std, size):
    rng = default_rng()
    return rng.normal(mean, std, (size, 2))


def scale(series):
    a = 1+(series / np.abs(series).max())
    return 100 * a / 2


def make_dataset(num_clusters, std, points):
    data = []
    for cluster in range(num_clusters):
        angle = np.pi *2 * cluster / num_clusters
        x = np.cos(angle)
        y = np.sin(angle)
        cluster_data = make_cluster((x, y), std, points// num_clusters)
        data.append(cluster_data)
    data = np.concatenate(data)
    x = scale(data[:, 0])
    y = scale(data[:, 1])
    data = [{'x': x, 'y': y} for x, y in zip(x, y)]

    Path('data/new').mkdir(exist_ok=True)
    scaled_json = json.dumps(data)
    (Path('data') / 'new' / f'{num_clusters}_{std}.json').write_text(scaled_json)

    return data
