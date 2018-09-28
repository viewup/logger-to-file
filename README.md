# Logger to file 

Este módulo tem como finalidade  escrever os registro de log de um servidor em arquivo acompanhado de um console.log.

## Instalação

npm i logger-to-file

### Uso

importe o logger-to-file no projeto da seguinte forma :

import Logger from 'logger-to-file';


Logger.getInstance().register("string") <- Adiciona no cache e emite um console.log->

Logger.getInstance().register("erro algum erro aconteceu") <-  emite um console.error->

Logger.getInstance().flush() <- Cria um arquivo e escreve Tudo que estiver em cache nomeando o arquivo com a data atual  no formato ISO (DD_MM_YYYY) ->

Logger.getInstance().() <- Cria um arquivo e escreve Tudo que estiver em cache nomeando o arquivo com a data atual  no formato ISO (DD_MM_YYYY) ->






