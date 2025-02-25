# Criação da Instância EC2 para API

Este guia descreve o processo de criação de uma instância EC2 na AWS para hospedar a API Node.js do sistema de plantas.

## 1. Acessando o AWS Console

1. Abra seu navegador e acesse o console AWS: https://aws.amazon.com
2. Faça login com suas credenciais AWS
3. Você será direcionado para o dashboard AWS

![AWS Console Login](imagens/aws-console.png)

## 2. Navegação para EC2

1. No campo de busca superior, digite "EC2"
2. Selecione "EC2" nos resultados da pesquisa

![Busca por EC2](imagens/busca-ec2.png)

## 3. Criando a Instância

1. Na dashboard do EC2, clique no botão laranja "Launch Instance"

![Launch Instance](imagens/launch-instance.png)

2. Em "Name and tags", digite "plants-api"

![Nome da Instância](imagens/instance-name.png)

3. Em "Application and OS Images":
   - Mantenha "Amazon Linux 2023 AMI" selecionado
   - Verifique se mostra "Free tier eligible"

![Seleção de AMI](imagens/ami-selection.png)

4. Em "Instance type":
   - Selecione "t2.micro" (elegível para o free tier)
   - Verifique se mostra "Free tier eligible"

![Tipo de Instância](imagens/instance-type.png)

5. Em "Key pair":
   - Clique em "Create new key pair"
   - Nome: plants-api-key
   - Tipo: RSA
   - Formato: .pem
   - Clique em "Create key pair"
   - O arquivo .pem será baixado automaticamente - guarde-o em local seguro!

![Criação de Key Pair](imagens/key-pair.png)

6. Em "Network settings":
   - Mantenha a VPC padrão
   - Auto-assign public IP: Enable
   - Certifique-se de que "Allow SSH traffic from" está marcado
   - Selecione "Allow HTTP traffic from the internet"
   - Selecione "Allow HTTPS traffic from the internet"

7. Adicione uma regra customizada para a API:
   - Clique em "Add security group rule"
   - Type: Custom TCP
   - Port range: 3000
   - Source: Anywhere (0.0.0.0/0)
   - Description: "API port"

![Security Group](imagens/security-group.png)

8. Em "Configure storage":
   - Mantenha 8 GB (padrão)
   - Tipo: gp2

9. Em "Advanced details":
   - Deixe todas as configurações em seus valores padrão

10. Revise todas as configurações na seção "Summary" à direita
   - Verifique se a instância é t2.micro
   - Verifique se a regra de segurança para a porta 3000 está presente
   - Certifique-se de que a chave SSH está configurada

11. Clique em "Launch instance"

12. Na página de confirmação, clique em "View all instances"

## 4. Acessando a Instância

1. Na lista de instâncias, encontre a "plants-api"
2. Aguarde até o "Instance State" mostrar "Running" e todas as verificações de status mostrarem "2/2 checks passed"
3. Selecione a instância e observe o painel inferior
4. Copie o "Public IPv4 address" exibido - você usará esse IP para se conectar via SSH e acessar a API

![IP da Instância](imagens/instance-ip.png)

## 5. Conectando-se via SSH (Windows)

Se estiver usando Windows:

1. Abra o PuTTY
2. Em "Host Name", digite: ec2-user@SEU-IP-AQUI
3. Porta: 22
4. Em Connection > SSH > Auth > Credentials:
   - Clique em "Browse" e selecione o arquivo .pem que você baixou
   - Você pode precisar converter o arquivo .pem para .ppk usando o PuTTYgen
5. Clique em "Open"

## 6. Conectando-se via SSH (Mac/Linux)

Se estiver usando Mac ou Linux:

1. Abra o Terminal
2. Navegue até a pasta onde seu arquivo .pem está salvo
3. Execute o comando para definir as permissões corretas:
   ```bash
   chmod 400 plants-api-key.pem
   ```
4. Conecte-se à instância:
   ```bash
   ssh -i plants-api-key.pem ec2-user@SEU-IP-AQUI
   ```

## 7. Verificando a Conexão

Após conectar-se à instância, você deve ver algo como:

```
       __|  __|_  )
       _|  (     /   Amazon Linux 2 AMI
      ___|\___|___|

https://aws.amazon.com/amazon-linux-2/
[ec2-user@ip-172-31-XX-XX ~]$
```

Agora você pode começar a configurar o servidor para executar a API Node.js.

## 8. Configuração da Instância para a API

Os próximos passos estão detalhados no documento `deploy_backend.md`, mas em resumo:

1. Atualize o sistema:
   ```bash
   sudo yum update -y
   ```

2. Instale o Node.js via NVM:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   source ~/.nvm/nvm.sh
   nvm install 18
   ```

3. Instale o PM2 para gerenciar o processo da API:
   ```bash
   npm install -g pm2
   ```

4. Crie a estrutura de diretórios para a aplicação:
   ```bash
   mkdir -p ~/app/database
   chmod 777 ~/app/database
   ```

## 9. Adicionando Tags (Opcional)

Para melhor organização, adicione tags à sua instância:

1. Selecione a instância
2. Clique na aba "Tags"
3. Clique em "Manage tags"
4. Adicione tags como:
   - Name: plants-api
   - Environment: production
   - Project: aws-challenge

## 10. Monitoramento Básico

No console EC2, com sua instância selecionada, você pode ver:
- CPU Utilization
- Network In/Out
- Status Checks

Isso permite monitorar o desempenho básico da sua instância.

## 11. Desligando a Instância (quando não for mais necessária)

1. Selecione a instância
2. Clique em "Instance state"
3. Selecione "Stop instance" para pausar (pode ser reiniciada)
4. Ou selecione "Terminate instance" para encerrar permanentemente

**Importante**: "Terminate" vai destruir completamente a instância e todos os dados nela! Use com cuidado.

Sua instância EC2 agora está pronta para hospedar a API Node.js do sistema de plantas. Siga para o documento `deploy_backend.md` para continuar com o processo de deploy.
