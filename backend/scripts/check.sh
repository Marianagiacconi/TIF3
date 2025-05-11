#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔍 Ejecutando verificaciones de código..."

# Verificar formato con black
echo -e "\n${GREEN}Verificando formato con black...${NC}"
black --check app tests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ black encontró errores de formato${NC}"
    exit 1
fi

# Verificar imports con isort
echo -e "\n${GREEN}Verificando imports con isort...${NC}"
isort --check-only app tests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ isort encontró errores en los imports${NC}"
    exit 1
fi

# Verificar estilo con flake8
echo -e "\n${GREEN}Verificando estilo con flake8...${NC}"
flake8 app tests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ flake8 encontró errores de estilo${NC}"
    exit 1
fi

# Verificar tipos con mypy
echo -e "\n${GREEN}Verificando tipos con mypy...${NC}"
mypy app
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ mypy encontró errores de tipos${NC}"
    exit 1
fi

# Ejecutar tests
echo -e "\n${GREEN}Ejecutando tests...${NC}"
pytest
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Los tests fallaron${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Todas las verificaciones pasaron exitosamente!${NC}" 