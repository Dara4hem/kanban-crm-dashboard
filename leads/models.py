from django.db import models

class Lead(models.Model):
    STAGE_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='new')

    def __str__(self):
        return self.name
