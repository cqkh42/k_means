# not sure where we got the data from
from pathlib import Path
import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler

def scale(series):
    d_1 = max(series)
    d_0 = min(series)
    a = 1000 / (d_1 + 10 - d_0)
    b = a * (5 - d_0)
    return [a * i + b for i in series]

Path('scaled_data').mkdir(exist_ok=True)

for file in Path('unscaled_data').glob('*.json'):
    data = json.loads(file.read_text())
    x = [val['x'] for val in data]
    y = [val['y'] for val in data]
    scaled_x = scale(x)
    scaled_y = scale(y)
    scaled_x = [round(x, 1) for x in scaled_x]
    scaled_y = [round(y, 1) for y in scaled_y]
    scaled_dict = [
        {'x': x, 'y': y, 'cluster': 0} for x, y in zip(scaled_x, scaled_y)
    ]
    scaled_json = json.dumps(scaled_dict)
    (Path('scaled_data') / file.name).write_text(scaled_json)