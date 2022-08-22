from multiprocessing.connection import Client
from google.cloud.sql.connector import Connector
import sqlalchemy
import pymysql
import os

from flask import Flask, flash, redirect, render_template
from flask import jsonify
import datetime

#configure the Flask application 
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def query():
    # initialize Connector object
    connector = Connector()

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="C:/Users/camil/Downloads/lofty-object-358322-a5260a66a36c.json"
    # function to return the database connection
    def getconn() -> pymysql.connections.Connection:
        conn: pymysql.connections.Connection = connector.connect(
            "lofty-object-358322:southamerica-east1:myinstance",
            "pymysql",
            user="camila",
            password="fuzzY154",
            db="registros"
        )
        return conn

    # create connection pool
    pool = sqlalchemy.create_engine(
        "mysql+pymysql://",
        creator=getconn,
    )
    #insert_stmt = sqlalchemy.text(
        #"INSERT INTO delitos (id, nombre) VALUES (:id, :nombre)",
    #)

    with pool.connect() as db_conn:
        # insert into database
        #db_conn.execute(insert_stmt, id=2, nombre="HURTO")

        # query database
        result = db_conn.execute("SELECT * from delitos").fetchall()

        # Do something with the results
        for row in result:
            print(row)

    ##connector.close()