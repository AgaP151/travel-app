#!/bin/bash

set -a
source backend/.env
set +a

cd backend
./mvnw spring-boot:run