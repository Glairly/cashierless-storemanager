## Install Dependencies

```bash
pip install -r requirements.txt
```
and also install database we are using ``mongodb`` here

## To serve 

create a configuration file beside ``app.py`` level as ``config.json`` that contains something like
```json
{
    "mongoClientURL": "mongodb://localhost:27017/",
    "dbName": "cashierless"
}
```

```bash
# In /backend
uvicorn --app-dir=fastapi app:app --reload  
```

app should be served on: https://localhost:8000

for swagger: https://localhost:8000/docs