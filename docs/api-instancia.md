## api-instancia.md

# Criação da Instância EC2 para API

### 1. Acessando o AWS Console
1. Abra seu navegador e acesse o console AWS: https://aws.amazon.com
2. Faça login com suas credenciais
3. Você será direcionado para o dashboard AWS

![AWS Console Login](imagens/aws-console.png)

### 2. Navegação para EC2
1. No campo de busca superior, digite "EC2"
2. Selecione "EC2" nos resultados da pesquisa

![Busca por EC2](imagens/busca-ec2.png)

### 3. Criando a Instância
1. Na dashboard do EC2, clique no botão laranja "Launch Instance"

![Launch Instance](imagens/launch-instance.png)

2. Em "Name and tags", digite "plants-api"

![Nome da Instância](imagens/instance-name.png)

3. Em "Application and OS Images":
    - Mantenha "Amazon Linux 2023 AMI" selecionado
    - Verifique se mostra "Free tier eligible"

![Seleção de AMI](imagens/ami-selection.png)

4. Em "Instance type":
    - Selecione "t2.micro"
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

7. Configure "Firewall (security groups)":
    - Selecione "Create security group"
    - Security group name: plants-api-sg
    - Description: "Security group for Plants API"

8. Configure Inbound Rules (regras de entrada):
    - Mantenha a regra SSH (porta 22)
    - Clique em "Add security group rule" para adicionar:

      a) HTTP:
        - Type: HTTP
        - Source: Anywhere-IPv4

      b) API:
        - Type: Custom TCP
        - Port range: 3000
        - Source: Anywhere-IPv4
        - Description: "API port"

![Security Group](imagens/security-group.png)

9. Em "Configure storage":
    - Mantenha 8 GB (padrão)
    - Tipo: gp2

10. Revise todas as configurações e clique em "Launch instance"

11. Após a criação, clique em "View all instances"

### 4. Acessando a Instância
1. Na lista de instâncias, encontre a "plants-api"
2. Aguarde até o "Instance State" mostrar "Running"
3. Copie o "Public IPv4 address" exibido

![IP da Instância](imagens/instance-ip.png)

---