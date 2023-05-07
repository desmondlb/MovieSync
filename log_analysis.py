import pandas as pd
import matplotlib.pyplot as plt
import datetime
import numpy as np

# import pandas as pd

# Read the log file
df = pd.read_csv('log.txt', sep='|', engine='python', header=None,
                 names=['Timestamp', 'RoomCode', 'UserName', 'Action'])


df['Timestamp'] = pd.to_datetime(df['Timestamp'], utc=True)
df['Timestamp'] = df['Timestamp'].astype(int) // 10**6

# Group by RoomCode and calculate average latency
grouped = df.groupby('RoomCode')

for name, group in grouped:

    group = group.sort_values('Timestamp')
    if str(group["RoomCode"].iloc[0]).strip() == "":
        continue

    action_df = group.groupby('Action')

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


df = pd.read_csv('bufferLog.txt', sep='|', engine='python', header=None,
                 names=['Timestamp', 'RoomCode', 'UserName', 'BufferRate'])


df['Timestamp'] = pd.to_datetime(df['Timestamp'], utc=True)
df['Timestamp'] = df['Timestamp'].astype(int) // 10**6

grouped = df.groupby('RoomCode')

for name, group in grouped:
    group = group.sort_values('Timestamp')
    username_df = group.groupby('UserName')

    for n, g in username_df:
        print(n)
        fig, ax = plt.subplots()
        ax.plot(g['Timestamp'], g['BufferRate'])
        ax.set_xlabel("Time")
        ax.set_ylabel("Buffer Rate")
        plt.show()
