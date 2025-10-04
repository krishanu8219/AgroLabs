import datetime as dt
import meteomatics.api as api

username = 'gupta_achintya'
password = 's21pmVNR8FgU41C8sV0V'

coordinates = [(47.11, 11.47)]
parameters = ['t_2m:C', 'precip_1h:mm', 'wind_speed_10m:ms']
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