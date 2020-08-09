# Lasso - Lighthouse as a service

> An API service built on top of [lighthouse](https://github.com/GoogleChrome/lighthouse#readme) to automate running Lighthouse tests on large number of URLs in parallel. Utilizes [Cloud Run](https://cloud.google.com/run) and [Cloud Tasks](https://cloud.google.com/tasks) to distribute and run multiple tests across multiple containers, outputs results to a [BigQuery](https://cloud.google.com/bigquery) dataset.

## Features

✅ Bulk test 100s of URLs with lighthouse asynchronously

✅ Writes test results to a date partitioned BigQuery table

✅ Specify which resource requests to block from tests e.g. For running tests excluding 3rd party scripts or libraries

## Setup

### Deploying to Cloud Run

Create a build from the Docker file and create a new tag

`docker build -t lasso .`

Tag the built image for GCR targeting the cloud project

`docker tag lasso gcr.io/[CLOUD-PROJECT-ID]/lasso:v1`

Push to GCR (Make sure the GCR API is [enabled](https://console.cloud.google.com/apis/api/containerregistry.googleapis.com/overview?project=lasso-285806) already)

`docker push gcr.io/[CLOUD-PROJECT-ID]/lasso:v1`

To learn more about configuring a Cloud Run service, you can follow [this guide](https://cloud.google.com/run/docs/deploying). 

The following ENV variables will need to be configured on cloud run:

| ENV var  | Description |
| ------------- | ------------- |
| BQ_DATASET  | The name of a BigQuery dataset containing your results table |
| BQ_TABLE  | The name of the BQ table to output results to |
| CLOUD_TASKS_QUEUE  | Name of your cloud tasks queue |
| CLOUD_TASKS_QUEUE_LOCATION  | Location of the cloud task queue |
| SERVICE_URL  | base url and protocol of the deployed service on cloud run |


### Running Locally via docker compose

#### Setting Environment Variables

Set the path for the Google Cloud credentials of the project as an ENV variable in your system on `GCP_KEY_PATH`. This value will be picked up by the docker compose config mapped to a volume and set on the running container. The following ENV variables will need to be configured in docker-compose.yml:

| ENV var  | Description |
| ------------- | ------------- |
| BQ_DATASET  | The name of a BigQuery dataset containing your results table |
| BQ_TABLE  | The name of the BQ table to output results to |
| GOOGLE_CLOUD_PROJECT  | ID of your cloud project |
| CLOUD_TASKS_QUEUE  | Name of your cloud tasks queue |
| CLOUD_TASKS_QUEUE_LOCATION  | Location of the cloud task queue |
| SERVICE_URL  | base url and protocol of the deployed service on cloud run |

#### Run

For local development, you can choose to run the project via [docker compose](https://cloud.google.com/community/tutorials/cloud-run-local-dev-docker-compose). Running `docker-compose up` launches the service.

### Running the image directly locally or on a server

```
PORT=8080 && docker run \
   -p 8080:${PORT} \
   -e PORT=${PORT} \
   -e BQ_DATASET=lh_results \
   -e BQ_TABLE=psmetrics \
   -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/keys/lighthouse-service-09c62b8cd84e.json \
   -v $GOOGLE_APPLICATION_CREDENTIALS:/tmp/keys/lighthouse-service-09c62b8cd84e.json:ro \
   gcr.io/lighthouse-service/pagespeed-metrics
```

## Using the service API

### /audit - Runs multiple audits sequentially

**Parameters**

| Name | Type | Optional | Description
| ------------- | ------------- | ------------- | ------------- |
| urls  | Array | | List of urls to run a lighthouse audit on |
| blockedRequests  | Array | Yes | List of requests to block on each audit e.g. 3rd party tag origins |

**Example**

```
curl -X POST \
  http://127.0.0.1:8080/audit \
  -H 'content-type: application/json' \
  -d '{
  "urls": [
    "https://www.exampleurl1.com",
    "https://www.exampleurl1.com",
    ...
    ]
  }'
```

### Scheduling async audits
WIP

### Listing active tasks
WIP

## Disclaimer
This is not an officially supported Google product.
