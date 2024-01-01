import flask
import json
import os
import sys
import numpy as np
import pandas as pd
import sqlite3

from flask import jsonify
from sqlalchemy import create_engine


app = flask.Flask(__name__)


def create_connection(db_file):
    # create a database connection to a SQLite database
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    return conn


df = pd.read_csv("Data.csv")
df2 = pd.read_csv("car_sales_data.csv")


@app.route('/')
@app.route('/index')
def index():
    return flask.render_template('index.html')


@app.route('/About')
def About():
    return flask.render_template('About.html')


@app.route('/get-datachart')
def get_datachart():
    Date = df["Date"].values
    Open = df["Open"].values
    High = df["High"].values
    Low = df["Low"].values
    Close = df["Close"].values
    Volume = df["Volume"].values
    data = []
    for i in range(len(Volume)):
        data.append({"Date": int(Date[i])*1000,
                     "Open": int(Open[i]),
                     "High": int(High[i]),
                     "Low": int(Low[i]),
                     "Close": int(Close[i]),
                     "Volume": int(Volume[i])})

    return jsonify(data)


@app.route('/get-datachart2')
def get_datachart2():
    data = {}

    for _, row in df2.iterrows():
        brand = row['Brand']
        model = row['Model']
        sales = int(row['Sales'])

        if brand not in data:
            data[brand] = {}

        data[brand][model] = sales

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
