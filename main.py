import datetime as dt
import meteomatics.api as api

username = 'gupta_achintya'
password = 's21pmVNR8FgU41C8sV0V'

coordinates = [(47.11, 11.47)]
parameters = ['wind_speed_10m:ms',
    'msl_pressure:hPa',
    'soil_moisture_deficit:mm',
    'evapotranspiration_1h:mm',
    'air_quality:idx',
    'pm2p5:ugm3',
    'forest_fire_warning:idx',
    't_2m:C',
    'precip_1h:mm',
    'leaf_wetness:idx']
model = 'mix'

current_time = dt.datetime.now(dt.UTC).replace(minute=0, second=0, microsecond=0)

df = api.query_time_series(
    coordinates,
    current_time,
    current_time,
    dt.timedelta(hours=1),
    parameters,
    username,
    password,
    model=model
)

print(df)