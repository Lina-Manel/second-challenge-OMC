#!/bin/bash
while true; do
    git add .
    git commit -m "Mise à jour automatique"
    git push origin master
    sleep 60  # Attendre 60 secondes avant de recommencer
done
