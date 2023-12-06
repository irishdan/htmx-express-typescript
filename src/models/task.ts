import sequelize from './dbconfig';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';

class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare completedAt: Date | null;
}

Task.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    completedAt: DataTypes.DATE,
}, { sequelize, tableName: 'tasks' });

export default Task;
