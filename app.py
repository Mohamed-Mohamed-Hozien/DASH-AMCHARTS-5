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


# df = pd.read_csv("Data.csv")
# connection = create_connection("Stock.db")
# df.to_sql("Stock", connection, if_exists='replace')
# connection.close()


# df2 = pd.read_csv("car_sales_data.csv")
# connection = create_connection("Model_prices.db")
# df2.to_sql("Model_prices", connection, if_exists='replace')
# connection.close()


# df3 = pd.read_csv("ford.csv")
# connection = create_connection("ford_model_prices.db")
# df3.to_sql("ford_model_prices", connection, if_exists='replace')
# connection.close()


@app.route('/')
@app.route('/index')
def index():
    return flask.render_template('index.html')


@app.route('/About')
def About():
    return flask.render_template('About.html')


@app.route('/get-datachart')
def get_datachart():
    db_url = 'sqlite:///Stock.db'
    engine = create_engine(db_url, echo=True)
    df = pd.read_sql('select * from Stock', engine)
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
    db_url = 'sqlite:///Model_prices.db'
    engine = create_engine(db_url, echo=True)
    df = pd.read_sql('select * from Model_prices', engine)
    data = {}

    for _, row in df.iterrows():
        brand = row['Brand']
        model = row['Model']
        sales = int(row['Sales'])

        if brand not in data:
            data[brand] = {}

        data[brand][model] = sales

    return jsonify(data)


@app.route('/get-datachart3')
def get_datachart3():
    db_url = 'sqlite:///ford_model_prices.db'
    engine = create_engine(db_url, echo=True)
    df = pd.read_sql('select * from ford_model_prices', engine)
    data = []

    # Group the DataFrame by 'model' and calculate the sum of 'price' for each group
    grouped_data = df.groupby('model')['price'].sum().reset_index()

    # Convert the grouped data to a list of dictionaries
    for _, row in grouped_data.iterrows():
        model = row['model'].strip()
        sum_of_price = int(row['price'])

        data.append({'model': model, 'Sum of price': sum_of_price})

    return jsonify(data)

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
