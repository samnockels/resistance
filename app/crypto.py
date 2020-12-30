from cryptography.fernet import Fernet
key = '81792wbaNvC1n2AuaDCPtauP7mZ8oquaBK38QrCH7Wo='


def encrypt(string):
    return Fernet(key).encrypt(string.encode()).decode()


def decrypt(encrypted):
    return Fernet(key).decrypt(encrypted.encode()).decode()
