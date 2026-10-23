#!/bin/bash
# Se a quantidade de argumentos ($#) for igual a (-eq) 0(zero)
if [ $# -eq 0 ]; then
    echo "Nenhum argumento fornecido!"
else
    echo "$1"
    echo "$2"
    echo "$3"
fi
