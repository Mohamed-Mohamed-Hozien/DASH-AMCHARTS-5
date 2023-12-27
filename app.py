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


@app.route('/')
@app.route('/index')
def index():
    return flask.render_template('index.html')


@app.route('/About')
def About():
    return flask.render_template('About.html')


@app.route('/get-datachart1')
def get_datachart():
    Date = df["Date"].values
    Volume = df["Volume"].values
    data = []
    for i in range(len(Volume)):
        data.append({"Date": Date[i], "Volume": int(Volume[i])})

    return jsonify(data)


@app.route('/get-datatable1')
def get_datatable():
    return jsonify(df.head(10).to_html())


if __name__ == '__main__':
    app.run(debug=True)
