#!/bin/bash
# Verifica se o usuário esqueceu de passar o argumento
if [ $# -eq 0 ]; then
    echo "Erro: Informe o nome ou número da pasta."
    exit 1
fi

# Cria a pasta juntando "ex" com o primeiro argumento ($1)
for arg in "$@" 
do
mkdir "ex$arg"
done 
