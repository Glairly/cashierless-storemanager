"""migrate tables

Revision ID: 0cce10fa7bbd
Revises: 7079c8e154ac
Create Date: 2023-03-18 17:29:56.845981

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0cce10fa7bbd'
down_revision = '7079c8e154ac'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('clients', sa.Column('phone_number', sa.String(), nullable=True))
    op.add_column('clients', sa.Column('gender', sa.String(), nullable=True))
    op.add_column('clients', sa.Column('birthdate', sa.Time(), nullable=True))
    op.create_index(op.f('ix_clients_phone_number'), 'clients', ['phone_number'], unique=True)
    op.add_column('shops', sa.Column('phone_number', sa.String(), nullable=True))
    op.add_column('shops', sa.Column('join_date', sa.Time(), nullable=True))
    op.create_index(op.f('ix_shops_phone_number'), 'shops', ['phone_number'], unique=True)
    op.add_column('transactions', sa.Column('date', sa.Time(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('transactions', 'date')
    op.drop_index(op.f('ix_shops_phone_number'), table_name='shops')
    op.drop_column('shops', 'join_date')
    op.drop_column('shops', 'phone_number')
    op.drop_index(op.f('ix_clients_phone_number'), table_name='clients')
    op.drop_column('clients', 'birthdate')
    op.drop_column('clients', 'gender')
    op.drop_column('clients', 'phone_number')
    # ### end Alembic commands ###
