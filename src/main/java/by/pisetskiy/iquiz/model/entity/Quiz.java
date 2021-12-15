package by.pisetskiy.iquiz.model.entity;

import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class Quiz extends BaseEntity {

    private String title;
}
