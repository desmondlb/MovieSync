import pandas as pd
import matplotlib.pyplot as plt
import datetime
import numpy as np

# import pandas as pd

# Read the log file
df = pd.read_csv('./s3_mp4/log4.txt', sep='|', engine='python', header=None,
                 names=['Timestamp', 'RoomCode', 'UserName', 'Action'])


df['Timestamp'] = pd.to_datetime(df['Timestamp'], utc=True)
df['Timestamp'] = df['Timestamp'].astype(int) // 10**6

# Group by RoomCode and calculate average latency
grouped = df.groupby('RoomCode')

dict_lat_per_room = {}

for name, group in grouped:

    group = group.sort_values('Timestamp')
    if str(group["RoomCode"].iloc[0]).strip() == "":
        continue

    action_df = group.groupby('Action')
    lat_per_group = []
    for action, g in action_df:
        set_users = set()
        latency_values = []
        prev = None
        if len(g) == 1:
            continue
        for index, row in g.iterrows():
            if row['UserName'] in set_users:
                num_clients = len(set_users)
                set_users.clear()
                latency = (sum(latency_values[1:]) - latency_values[0]
                           * len(latency_values[1:])) / (len(latency_values)-1)
                print(
                    f'Act:{action} | RC: {prev["RoomCode"]} | Lat:{latency}ms | NumClients {num_clients}')
                lat_per_group.append(latency)
                latency_values = []
                prev = None

            set_users.add(row['UserName'])
            latency_values.append(row['Timestamp'])
            prev = row

        num_clients = len(set_users)
        latency = (sum(latency_values[1:]) - latency_values[0]
                   * len(latency_values[1:])) / (len(latency_values)-1)
        print(
            f'Act:{action} | RC: {prev["RoomCode"]} | Lat:{latency}ms | NumClients {num_clients}')
        lat_per_group.append(latency)

    dict_lat_per_room[name] = sum(lat_per_group)/len(lat_per_group)

print(dict_lat_per_room)

df = pd.read_csv('./s3_mp4/bufferLog4.txt', sep='|', engine='python', header=None,
                 names=['Timestamp', 'RoomCode', 'UserName', 'BufferRate'])


df['Timestamp'] = pd.to_datetime(df['Timestamp'], utc=True)
df['Timestamp'] = df['Timestamp'].astype(int) // 10**6

grouped = df.groupby('RoomCode')

colors = ['r', 'g', 'b', 'm', 'y', 'c', 'k', 'w', 'orange',
          'purple', 'brown', 'pink', 'gray', 'olive', 'teal']

for name, group in grouped:
    group = group.sort_values('Timestamp')
    username_df = group.groupby('UserName')

    fig, ax = plt.subplots()
    ax.set_xlabel("Time")
    ax.set_ylabel("Buffer Rate")

    for i, (username, df) in enumerate(username_df):
        ax.plot(df['Timestamp'], df['BufferRate'],
                color=colors[i % len(colors)], label=username)

    ax.legend()
    plt.show()


df = pd.read_csv('./s3_mp4/bitRateLog4.txt', sep='|', engine='python', header=None,
                 names=['Timestamp', 'RoomCode', 'UserName', 'BitRate'])


df['Timestamp'] = pd.to_datetime(df['Timestamp'], utc=True)
df['Timestamp'] = df['Timestamp'].astype(int) // 10**6

grouped = df.groupby('RoomCode')

for name, group in grouped:
    group = group.sort_values('Timestamp')
    username_df = group.groupby('UserName')

    fig, ax = plt.subplots()
    ax.set_xlabel("Time")
    ax.set_ylabel("Bit Rate")

    for i, (username, df) in enumerate(username_df):
        ax.plot(df['Timestamp'], df['BitRate'],
                color=colors[i % len(colors)], label=username)

    ax.legend()
    plt.show()
