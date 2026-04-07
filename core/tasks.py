from celery import shared_task
from django.core.management import call_command
import logging

logger = logging.getLogger(__name__)

@shared_task
def sync_maritime_data_task():
    """
    Periodic task to sync AIS, Port, Safety, and Compliance data.
    """
    logger.info("Executing periodic maritime data synchronization...")
    try:
        call_command('sync_ais')
        call_command('sync_port_safety')
        call_command('sync_compliance')
        logger.info("Maritime data sync completed successfully.")
    except Exception as e:
        logger.error(f"Error during maritime data sync: {str(e)}")
