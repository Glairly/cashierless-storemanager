"""migrate tables

Revision ID: f890c68004bc
Revises: f1c9a614ad53
Create Date: 2023-04-20 03:45:18.911485

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f890c68004bc'
down_revision = 'f1c9a614ad53'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('transaction_items', sa.Column('item_name', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('transaction_items', 'item_name')
    # ### end Alembic commands ###