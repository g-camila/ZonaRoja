# initialize parameters
INSTANCE_CONNECTION_NAME = f"My First Project:southamerica-east1-c:myinstance" # i.e demo-project:us-central1:demo-instance
print(f"Your instance connection name is: camila")
DB_USER = "root"
DB_PASS = "fuzzY154"
DB_HOST="35.198.59.164"
DB_NAME = "registros"

from google.cloud.sql.connector import Connector
import sqlalchemy

# initialize Connector object
connector = Connector()

# function to return the database connection object
def getconn():
    conn = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pymysql",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME
    )
    return conn

# create connection pool with 'creator' argument to our connection object function
pool = sqlalchemy.create_engine(
    "mysql+pymysql://",
    creator=getconn,
)

# insert statement
insert_stmt = sqlalchemy.text(
    "INSERT INTO delitos (id, nombre) VALUES (:id, :nombre)",
)
with pool.connect() as db_conn:
    # insert into database
    db_conn.execute(insert_stmt, id="1", nombre="ROBO")

    # query database
    result = db_conn.execute("SELECT * from delitos").fetchall()

    # Do something with the results
    for row in result:
        print(row)